import Link from "next/link";
import Image from "next/image";

export function AllSpaces({ spaces }: any) {
  return (
    <div
      className="grid gap-4 py-6
    grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      {spaces.data.spaces.map((space: any, index: any) => {
        return (
          <Link key={index} href={`/space/${space.name}`}>
            <div
              className="card card-compact bg-neutral shadow-xl
            transition-all duration-300 ease-linear
            cursor-pointer hover:scale-105 rounded-3xl"
            >
              <div className="card-body items-center">
                <div className="avatar">
                  <div className="w-28 rounded-full bg-base-100">
                    <Image
                      src={"/noun-47.png"}
                      alt={"org avatar"}
                      height={150}
                      width={150}
                    />
                  </div>
                </div>

                <h2 className="card-title mb-0">{space.name}</h2>
                <div className="card-actions justify-end">
                  <p>{space.members}</p>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
