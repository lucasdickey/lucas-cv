import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // searchParams.get() already returns decoded values
    const hasTitle = searchParams.has('title');
    const title = hasTitle
      ? searchParams.get('title')?.slice(0, 100)
      : 'Lucas Dickey - Product Leader & Serial Founder';
    
    const hasDate = searchParams.has('date');
    const date = hasDate ? searchParams.get('date') : null;
    
    const hasReadTime = searchParams.has('readTime');
    const readTime = hasReadTime ? searchParams.get('readTime') : null;

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#f5f5dc',
            backgroundImage: 'linear-gradient(135deg, #f5f5dc 0%, #e8e8d8 100%)',
            fontFamily: 'monospace',
            padding: '60px',
          }}
        >
          {/* Terminal window header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '40px',
            }}
          >
            <div
              style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                backgroundColor: '#ff6057',
                marginRight: '8px',
              }}
            />
            <div
              style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                backgroundColor: '#ffbd2e',
                marginRight: '8px',
              }}
            />
            <div
              style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                backgroundColor: '#28ca41',
              }}
            />
            <div
              style={{
                marginLeft: '20px',
                color: '#666666',
                fontSize: '24px',
              }}
            >
              terminal — bash
            </div>
          </div>

          {/* Main content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              justifyContent: 'center',
            }}
          >
            {/* Terminal prompt */}
            <div
              style={{
                fontSize: '32px',
                color: '#666666',
                marginBottom: '30px',
                display: 'flex',
              }}
            >
              <span style={{ color: '#8b0000', marginRight: '12px' }}>$</span>
              <span>cat blog-post.md</span>
            </div>

            {/* Blog post title */}
            <h1
              style={{
                fontSize: title && title.length > 50 ? '48px' : '56px',
                fontWeight: 'bold',
                color: '#8b0000',
                marginBottom: '30px',
                lineHeight: 1.2,
                maxWidth: '90%',
              }}
            >
              {title}
            </h1>

            {/* Meta information */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '28px',
                color: '#666666',
                marginBottom: '40px',
              }}
            >
              {date && (
                <>
                  <span>{date}</span>
                  {readTime && <span style={{ margin: '0 16px' }}>•</span>}
                </>
              )}
              {readTime && (
                <span>{readTime} min read</span>
              )}
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderTop: '2px solid #cccccc',
              paddingTop: '30px',
            }}
          >
            <div
              style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#333333',
              }}
            >
              lucasdickey.com
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (e) {
    console.log(`${e instanceof Error ? e.message : 'Unknown error'}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}