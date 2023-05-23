"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { twitterSignIn, useSession } from "@/providers/SessionProvider";
import handleMediaUpload from "@/lib/mediaUpload";
import { PhotoIcon } from "@heroicons/react/24/solid";

const variants = {
  enter: (direction: number) => {
    return {
      y: direction > 0 ? 1000 : -1000,
      opacity: 0,
    };
  },
  center: {
    zIndex: 1,
    y: 0,
    opacity: 1,
  },
  exit: (direction: number) => {
    return {
      zIndex: 100,
      y: direction < 0 ? 1000 : -1000,
      opacity: 0,
    };
  },
};

export default function CreateThread() {
  const [modalIsOpen, setModalisOpen] = useState(false);
  const [[currentStep, direction], setCurrentStep] = useState([0, 0]);
  const paginate = (newDirection: number) => {
    if (currentStep === 1 && newDirection < 0) {
      // Sliding up from tweet 2 to tweet 1
      setCurrentStep([currentStep + newDirection, newDirection * +1]);
    } else if (currentStep === 2 && newDirection > 0) {
      // Sliding down from tweet 3 to tweet 2
      setCurrentStep([currentStep + newDirection, newDirection * -1]);
    } else {
      setCurrentStep([currentStep + newDirection, newDirection]);
    }
  };

  const steps = [
    {
      component: <Tweet1 />,
    },
    {
      component: <Tweet2 />,
    },
    {
      component: <Tweet3 />,
    },
  ];

  return (
    <div>
      <button className="btn" onClick={() => setModalisOpen(true)}>
        thread
      </button>
      <Modal isModalOpen={modalIsOpen} onClose={() => setModalisOpen(false)}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            variants={variants}
            custom={direction}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              y: { type: "tween", ease: "easeOut", duration: 0.3 },
              opacity: { duration: 0.3 },
            }}
            className="flex flex-col w-full h-[600px] gap-4"
          >
            {currentStep > 0 && (
              <div
                className="w-full h-[80px] bg-pink-700 cursor-pointer"
                onClick={() => paginate(-1)}
              />
            )}
            <div className="w-full h-full bg-blue-600">
              {steps[currentStep].component}
            </div>
            {currentStep < steps.length - 1 && (
              <div
                className="w-full h-[80px] bg-green-700 cursor-pointer"
                onClick={() => paginate(1)}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </Modal>
    </div>
  );
}

const Modal = ({
  isModalOpen,
  children,
  onClose,
  title,
}: {
  isModalOpen: boolean;
  children: React.ReactNode;
  onClose: () => void;
  title?: string;
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalRef]);

  if (isModalOpen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 w-full">
        <div className="modal modal-open bg-transparent ">
          <div
            ref={modalRef}
            className="modal-box max-w-2xl overflow-hidden bg-transparent p-0"
          >
            {children}
          </div>
        </div>
        <div className="fixed inset-0 bg-black opacity-50"></div>
      </div>
    );
  }
  return null;
};

const Tweet1 = () => {
  const { data: session, status } = useSession();

  const [tweetText, setTweetText] = useState("");

  const handleChange = (e) => {
    const text = e.target.value;
    if (text.length <= 280) {
      setTweetText(text);
    }
  };

  const handleTextareaResize = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files).slice(0, 4);
    const images = files.map((file) => URL.createObjectURL(file));
    setUploadedImages(images);
  };
  const [uploadedImages, setUploadedImages] = useState([]);

  return (
    <div className="p-4 bg-base-100 rounded-lg shadow h-full">
      <div className="flex gap-4 justify-center w-full h-fit">
        {/* User Avatar */}
        {session?.user?.twitter?.profile_image_url && (
          <Image
            className="rounded-full"
            width={50}
            height={50}
            src={session?.user?.twitter?.profile_image_url}
            alt="User Avatar"
          />
        )}

        <div className="flex flex-col gap-4 items-start w-full h-fit">
          {/* User Info */}
          <div className="flex items-center space-x-2 w-full h-fit">
            <span className="font-semibold text-gray-800">
              {session?.user?.twitter?.name}
            </span>
            <span className="text-gray-500">
              {session?.user?.twitter?.username}
            </span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-500">2h</span>
          </div>

          {/* Tweet Textarea */}
          <textarea
            rows={1}
            placeholder="What's happening?"
            className="mt-1 p-2 textarea textarea-lg resize-none w-full overflow-y-hidden"
            style={{ height: "auto" }}
            value={tweetText}
            onChange={handleChange}
            onInput={handleTextareaResize}
          />
          <div className="text-gray-500 text-right">
            {280 - tweetText.length} characters remaining
          </div>

          {/* Uploaded Images */}
          {uploadedImages.length > 0 && (
            <div className="flex gap-2 h-1/3">
              {uploadedImages.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Uploaded Image ${index + 1}`}
                  className={
                    uploadedImages.length === 1
                      ? "w-full h-24"
                      : uploadedImages.length === 2
                      ? "w-1/2 h-1/4"
                      : "w-1/2 sm:w-1/3 lg:w-1/4 h-1/4"
                  }
                />
              ))}
            </div>
          )}

          {/* Button Section */}
          <div className="flex space-x-2 mt-2 w-full justify-between">
            <label
              htmlFor="image-upload"
              className="flex items-center btn btn-square btn-sm btn-ghost"
            >
              <PhotoIcon className="w-6 h-6" />
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
            <button className="bg-twitter hover:bg-twitter-600 text-white font-bold py-2 px-4 rounded focus:outline-none">
              Tweet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Tweet2 = () => {
  const { data: session, status } = useSession();

  const [tweetText, setTweetText] = useState("");

  const handleChange = (e) => {
    const text = e.target.value;
    if (text.length <= 280) {
      setTweetText(text);
    }
  };

  const handleTextareaResize = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };
  return (
    <div className="p-4 bg-base-100 rounded-lg shadow h-full">
      <div className="flex gap-4 justify-center w-full">
        {/* Twitter Profile */}
        <img
          src="https://placekitten.com/40/40"
          alt="User Avatar"
          className="w-10 h-10 rounded-full"
        />

        <div className="flex flex-col gap-4 items-start w-full">
          {/* Tweet Textarea */}
          <textarea
            rows={1}
            placeholder="Add another tweet"
            className=" p-2 textarea textarea-lg resize-none w-full overflow-y-hidden"
            style={{ height: "auto" }}
            value={tweetText}
            onChange={handleChange}
            onInput={handleTextareaResize}
          />
          <div className="text-gray-500 text-right">
            {280 - tweetText.length} characters remaining
          </div>
          {/* Button Section */}
          <div className="flex justify-between items-center mt-2 w-full">
            <div className="flex space-x-2">
              <button className="flex items-center btn btn-square btn-sm btn-ghost">
                <PhotoIcon className="w-6 h-6" />
              </button>
            </div>
            <button className="bg-twitter hover:bg-twitter-600 text-white font-bold py-2 px-4 rounded focus:outline-none">
              Tweet All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Tweet3 = () => {
  const { data: session, status } = useSession();

  const [tweetText, setTweetText] = useState("");

  const handleChange = (e) => {
    const text = e.target.value;
    if (text.length <= 280) {
      setTweetText(text);
    }
  };

  const handleTextareaResize = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };
  return (
    <div className="p-4 bg-base-100 rounded-lg shadow h-full">
      <div className="flex gap-4 justify-center w-full">
        {/* Twitter Profile */}
        <img
          src="https://placekitten.com/40/40"
          alt="User Avatar"
          className="w-10 h-10 rounded-full"
        />

        <div className="flex flex-col gap-4 items-start w-full">
          {/* Tweet Textarea */}
          <textarea
            rows={1}
            placeholder="Add another tweet"
            className="mt-1 p-2 textarea textarea-lg resize-none w-full overflow-y-hidden"
            style={{ height: "auto" }}
            value={tweetText}
            onChange={handleChange}
            onInput={handleTextareaResize}
          />
          <div className="text-gray-500 text-right">
            {280 - tweetText.length} characters remaining
          </div>
          {/* Button Section */}
          <div className="flex justify-between items-center mt-2 w-full">
            <div className="flex space-x-2">
              <button className="flex items-center btn btn-square btn-sm btn-ghost">
                <PhotoIcon className="w-6 h-6" />
              </button>
            </div>
            <button className="bg-twitter hover:bg-twitter-600 text-white font-bold py-2 px-4 rounded focus:outline-none">
              Tweet All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
