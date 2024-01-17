
export function mockTimeout(callback: (...args: any[]) => void, timeout = 300) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(callback && callback()), timeout);
  })
}

export async function mockDelay(timeout: number) {
  if (!timeout) {
    await (async () => { })()
  } else {
    await (async () => {
      await mockTimeout(() => { }, timeout);
    })()
  }
}