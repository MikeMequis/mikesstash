const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const MAX_DIM = 512;

function normalizeSvgFavicon(inputPath, outputPath) {
  const content = fs.readFileSync(inputPath, "utf8");

  const svgTagMatch = content.match(/<svg\b[^>]*>/i);
  if (!svgTagMatch) {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, content);
    return;
  }

  const svgTag = svgTagMatch[0];
  const widthMatch = svgTag.match(/\bwidth\s*=\s*"([^"]+)"/i);
  const heightMatch = svgTag.match(/\bheight\s*=\s*"([^"]+)"/i);
  const viewBoxMatch = svgTag.match(/\bviewBox\s*=\s*"([^"]+)"/i);

  const parseDim = (s) => {
    if (s === undefined || s === null) return NaN;
    const m = String(s).match(/^[\d.]+/);
    return m ? parseFloat(m[0]) : NaN;
  };

  let effectiveWidth = parseDim(widthMatch && widthMatch[1]);
  let effectiveHeight = parseDim(heightMatch && heightMatch[1]);

  if ((!isFinite(effectiveWidth) || !isFinite(effectiveHeight)) && viewBoxMatch) {
    const vb = viewBoxMatch[1].trim().split(/[\s,]+/).map(parseFloat);
    if (vb.length === 4) {
      if (!isFinite(effectiveWidth)) effectiveWidth = vb[2];
      if (!isFinite(effectiveHeight)) effectiveHeight = vb[3];
    }
  }

  const maxDim = Math.max(effectiveWidth || 0, effectiveHeight || 0);

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  const needsScale = isFinite(maxDim) && maxDim > MAX_DIM;
  const outWidth = needsScale
    ? Math.round(effectiveWidth * (MAX_DIM / maxDim))
    : effectiveWidth;
  const outHeight = needsScale
    ? Math.round(effectiveHeight * (MAX_DIM / maxDim))
    : effectiveHeight;

  let newSvgTag = svgTag;

  if (!viewBoxMatch && isFinite(effectiveWidth) && isFinite(effectiveHeight)) {
    newSvgTag = newSvgTag.replace(
      /<svg\b/i,
      `<svg viewBox="0 0 ${effectiveWidth} ${effectiveHeight}"`
    );
  }

  // Always emit explicit width/height so sharp doesn't compute density as NaN.
  if (isFinite(outWidth)) {
    if (/\bwidth\s*=\s*"/i.test(newSvgTag)) {
      newSvgTag = newSvgTag.replace(/\bwidth\s*=\s*"[^"]+"/i, `width="${outWidth}"`);
    } else {
      newSvgTag = newSvgTag.replace(/<svg\b/i, `<svg width="${outWidth}"`);
    }
  }
  if (isFinite(outHeight)) {
    if (/\bheight\s*=\s*"/i.test(newSvgTag)) {
      newSvgTag = newSvgTag.replace(/\bheight\s*=\s*"[^"]+"/i, `height="${outHeight}"`);
    } else {
      newSvgTag = newSvgTag.replace(/<svg\b/i, `<svg height="${outHeight}"`);
    }
  }

  fs.writeFileSync(outputPath, content.replace(svgTag, newSvgTag));
}

/**
 * Raster favicons (jpg/png/webp/...) keep their original colours; the stock
 * favicon plugin requires a square source, so pad the shorter side with
 * transparency instead of cropping, distorting, or adding coloured bars.
 */
async function normalizeRasterFavicon(inputPath, outputPath) {
  const metadata = await sharp(inputPath).metadata();
  const width = metadata.width || 0;
  const height = metadata.height || 0;
  const size = Math.min(Math.max(width, height) || MAX_DIM, MAX_DIM);

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  await sharp(inputPath)
    .resize(size, size, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toFile(outputPath);
}

async function normalizeFavicon(inputPath, outputPath) {
  const ext = path.extname(inputPath).toLowerCase();
  if (ext === ".svg") {
    normalizeSvgFavicon(inputPath, outputPath);
    return;
  }
  await normalizeRasterFavicon(inputPath, outputPath);
}

module.exports = normalizeFavicon;
module.exports.normalizeSvgFavicon = normalizeSvgFavicon;
module.exports.normalizeRasterFavicon = normalizeRasterFavicon;
