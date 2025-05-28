import React from "react";

const AboutUs: React.FC<React.HTMLAttributes<HTMLDivElement>> = (props) => {
  return (
    <div style={styles.container} {...props}>
      <h1>About Us</h1>
      <p>
        Welcome to Ecommerce Client — your trusted online store for quality
        products at great prices.
      </p>
      <p>
        Our mission is to deliver the best online shopping experience by
        offering top-notch customer service, fast shipping, and a carefully
        curated product range.
      </p>
      <p>
        We are a small team of passionate professionals committed to making
        e-commerce better for everyone. Thank you for choosing us!
      </p>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: "800px",
    margin: "40px auto",
    padding: "0 20px",
    fontFamily: "Arial, sans-serif",
    lineHeight: 1.6,
  },
};

export default AboutUs;
