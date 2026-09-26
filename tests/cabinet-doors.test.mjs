import test from 'node:test';
import assert from 'node:assert/strict';
import {CabinetDoors} from '../public/real-books/glass-cabinet.js';
const hinges=()=>[{rotation:{y:0}},{rotation:{y:0}}];
test('hinges reverse from their current pose and block browsing until clear',()=>{
 const nodes=hinges(),doors=new CabinetDoors(nodes);
 assert.equal(doors.open,false);assert.equal(doors.angle,0);assert.equal(doors.browseable,false);
 assert.ok(nodes[0].rotation.y===0);assert.equal(nodes[1].rotation.y,0);
 doors.setOpen(true);doors.update(2);
 assert.equal(doors.browseable,true);
 doors.setOpen(false);doors.update(.1);
 const angle=doors.angle;
 assert.ok(angle>0&&angle<Math.PI/2);assert.equal(doors.browseable,false);
 doors.setOpen(true);assert.equal(doors.angle,angle);
 doors.update(.1);assert.ok(doors.angle>angle);
 for(let i=0;i<100;i++)doors.update(.02);
 assert.equal(doors.browseable,true);
 assert.equal(nodes[0].rotation.y,-Math.PI/2);assert.equal(nodes[1].rotation.y,Math.PI/2);
});
test('door motion is independent of frame rate and honours reduced motion',()=>{
 const a=new CabinetDoors(hinges()),b=new CabinetDoors(hinges());
 a.setOpen(true);b.setOpen(true);a.update(.2);
 for(let i=0;i<20;i++)b.update(.01);
 assert.ok(Math.abs(a.angle-b.angle)<1e-10);
 const reduced=new CabinetDoors(hinges(),true);
 reduced.setOpen(false);assert.equal(reduced.angle,0);assert.equal(reduced.browseable,false);
 reduced.setOpen(true);assert.equal(reduced.angle,Math.PI/2);assert.equal(reduced.browseable,true);
});
