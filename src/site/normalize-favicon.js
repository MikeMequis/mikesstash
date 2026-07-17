const fs = require("fs");
const path = require("path");

const MAX_DIM = 512;

function normalizeFavicon(inputPath, outputPath) {
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

module.exports = normalizeFavicon;
