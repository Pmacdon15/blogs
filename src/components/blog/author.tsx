export default async function Author({
  authorNamePromise,
}: {
  authorNamePromise: Promise<string>;
}) {
  const authorName = await authorNamePromise;
  return <span>{authorName}</span>;
}
