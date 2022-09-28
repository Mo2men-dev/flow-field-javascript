export function randomIntFromRange(min, max) {
  let r = Math.floor(Math.random() * (max - min + 1) + min);
  if (r === 0) {
    return randomIntFromRange(min, max);
  }
  return r;
}

export function randomColor(colors) {
  return colors[Math.floor(Math.random() * colors.length)];
}
