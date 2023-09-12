import { createCanvas } from 'canvas';
import fs from 'fs';
import { Delaunay } from 'd3-delaunay';

const canvas = createCanvas(800, 800);
const ctx = canvas.getContext('2d');

// Test drawing to make sure canvas works
ctx.fillStyle = 'red';
ctx.fillRect(0, 0, 100, 100);
console.log('Test shape drawn.');

function generateVoronoiPoints(width, height, numPoints) {
  const points = Array.from({ length: numPoints }, () => [
    Math.random() * width,
    Math.random() * height,
  ]);

  const delaunay = Delaunay.from(points);
  const voronoi = delaunay.voronoi([0, 0, width, height]);

  console.log('Voronoi points generated.');
  return voronoi;
}

const voronoi = generateVoronoiPoints(800, 800, 100);

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function drawPolygon(points, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i][0], points[i][1]);
  }
  ctx.closePath();
  ctx.fill();
}

function mirrorPolygon(points, axisX) {
  return points.map((point) => [2 * axisX - point[0], point[1]]);
}

function mirrorPolygonVertical(points, axisX) {
  return points.map((point) => [2 * axisX - point[0], point[1]]);
}

function mirrorPolygonHorizontal(points, axisY) {
  return points.map((point) => [point[0], 2 * axisY - point[1]]);
}

function drawVoronoiWithSymmetry(voronoi) {
  const polygons = voronoi.cellPolygons();
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  
  for (let polygon of polygons) {
    const points = Array.from(polygon);
    const color = getRandomColor();
    
    // Draw original polygon
    drawPolygon(points, color);

    // Mirror vertically
    const mirroredVertical = mirrorPolygonVertical(points, centerX);
    drawPolygon(mirroredVertical, color);
    
    // Mirror horizontally
    const mirroredHorizontal = mirrorPolygonHorizontal(points, centerY);
    drawPolygon(mirroredHorizontal, color);

    // Mirror both vertically and horizontally
    const mirroredBoth = mirrorPolygonVertical(mirroredHorizontal, centerX);
    drawPolygon(mirroredBoth, color);
  }

  console.log('Voronoi diagram drawn with full symmetry.');
}

drawVoronoiWithSymmetry(voronoi);

const out = fs.createWriteStream(new URL('voronoi_symmetry.png', import.meta.url));
const stream = canvas.createPNGStream();
stream.pipe(out);
out.on('finish', () => console.log('The PNG file was created.'));
