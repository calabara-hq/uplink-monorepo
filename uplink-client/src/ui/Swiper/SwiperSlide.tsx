"use client";

const SwiperSlide = (props) => {
  const { children, ...rest } = props;
  return (
    <>
      {/* @ts-expect-error */}
      <swiper-slide {...rest} style={{ height: "auto" }}>
        {children}
        {/* @ts-expect-error */}
      </swiper-slide>
    </>
  );
};


export default SwiperSlide;
