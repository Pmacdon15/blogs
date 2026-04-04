import Image from "next/image";
export default async function CoverImage({
  titlePromise,
  coverImagePromise,
}: {
  titlePromise: Promise<string>;
  coverImagePromise: Promise<string | null>;
}) {
  const coverImageUrl = await coverImagePromise;
  const title = await titlePromise;
  if (coverImageUrl)
    return (
      <div className="w-full aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl relative border border-border/20">
        <Image
          height={500}
          width={500}
          src={coverImageUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
    );
}
