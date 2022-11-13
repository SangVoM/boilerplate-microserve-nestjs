export function invokeAsync<U>(
  fn: (cb: (err?: Error | undefined | null, res?: U) => void) => void,
) {
  return new Promise<U>((resolve, reject) => {
    fn((err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
}
