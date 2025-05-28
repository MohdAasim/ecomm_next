const ShimmerUi = () => {
  return (
    <>
      {Array.from({ length: 10 }).map((_, index) => (
        <div className="card_shimmer" key={index}></div>
      ))}
    </>
  );
};

export default ShimmerUi;
