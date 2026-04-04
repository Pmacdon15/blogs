export default async function CreatedAt({
  createdAtPromise,
}: {
  createdAtPromise: Promise<string>;
}) {
  const createdAt = await createdAtPromise;
  return (
    <time dateTime={createdAt}>
      {new Date(createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })}
    </time>
  );
}
