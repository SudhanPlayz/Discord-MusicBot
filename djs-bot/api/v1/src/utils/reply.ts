export function createReply<T>(data: T) {
  return {
    success: true,
    data: data,
  };
}
