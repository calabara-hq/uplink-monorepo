import Image from "next/image";




export default function SubmissionCard () {
    return (
        <div
        className="card card-compact lg:w-[325px] h-[500px] bg-base-100 shadow-xl transition-all duration-300 ease-linear hover:scale-110
                      cursor-pointer"
      >
        <figure className="">
          <Image
            src={"/noun-47.png"}
            alt="submission image"
            height={300}
            width={300}
            className="rounded-t-xl w-full "
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">Submission #1</h2>
          <p className="bg-neutral p-4 rounded-xl">If a dog chews shoes whose shoes does he choose?</p>
          <div className="card-actions justify-end">
            <button className="btn btn-primary">Vote</button>
          </div>
        </div>
      </div>
    );
}