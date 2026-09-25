#!/usr/bin/env python3
"""Extract evenly timed, orientation-correct video frames using FFmpeg.

Usage: python3 scripts/extract_bookshelf_frames.py VIDEO OUTPUT_DIR [--count 60]
The output directory must not already contain frame JPEGs.
"""
import argparse
import json
from pathlib import Path
import subprocess


def sample_indices(times, count):
    if count < 2 or count > len(times):
        raise ValueError('Frame count must be between 2 and the number of video frames')
    targets = [times[0] + (times[-1] - times[0]) * i / (count - 1) for i in range(count)]
    indices = [min(range(len(times)), key=lambda j: abs(times[j] - target)) for target in targets]
    if len(set(indices)) != count:
        raise ValueError('Video timing would repeat frames; choose a smaller count')
    return targets, indices


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('video', type=Path)
    parser.add_argument('output', type=Path)
    parser.add_argument('--count', type=int, default=60)
    args = parser.parse_args()
    folder = args.output / 'frames'
    folder.mkdir(parents=True, exist_ok=True)
    if list(folder.glob('frame-*.jpg')):
        parser.error('Output already contains frames; choose a new directory')
    info = json.loads(subprocess.check_output([
        'ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_frames',
        '-show_entries', 'frame=best_effort_timestamp_time', '-of', 'json', str(args.video)]))
    times = [float(frame['best_effort_timestamp_time']) for frame in info['frames']]
    targets, indices = sample_indices(times, args.count)
    select = 'select=' + '+'.join(f'eq(n\\,{i})' for i in indices)
    subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-n', '-i', str(args.video),
                    '-vf', select, '-fps_mode', 'vfr', '-q:v', '2', str(folder / 'frame-%02d.jpg')], check=True)
    manifest = {'source': args.video.name, 'videoFrames': len(times), 'count': args.count,
                'sampling': 'Nearest source frames to evenly spaced timestamps, including first and last',
                'frames': [{'file': f'frames/frame-{i+1:02d}.jpg', 'targetSeconds': round(t, 6),
                            'actualSeconds': times[j], 'sourceFrame': j}
                           for i, (t, j) in enumerate(zip(targets, indices))]}
    (args.output / 'manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
    rows = (args.count + 9) // 10
    subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-n', '-i', str(folder / 'frame-%02d.jpg'),
                    '-vf', f'scale=160:-1,tile=10x{rows}:padding=5:margin=5', '-frames:v', '1',
                    str(args.output / 'contact-sheet.jpg')], check=True)
    print(f'Extracted {len(indices)} frames into {args.output}')


if __name__ == '__main__':
    main()
