"use client"

export function StatusLabel({ status }: { status: string }) {
    if (status === "pending") {
      return <p className="badge lg:badge-lg">pending</p>;
    } else if (status === "submitting") {
      return <p className="badge badge-primary lg:badge-lg">submitting</p>;
    } else if (status === "voting") {
      return <p className="badge badge-secondary lg:badge-lg">voting</p>;
    } else if (status === "end") {
      return <p className="badge badge-ghost lg:badge-lg">closed</p>;
    } else {
      return null;
    }
  }
  