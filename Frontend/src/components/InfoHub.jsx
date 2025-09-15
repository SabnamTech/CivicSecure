import React from "react";
import { FaQuestionCircle, FaBook, FaExclamationTriangle, FaPhone, FaEnvelope } from "react-icons/fa";
import scheme1 from "../../src/assets/scheme1.png";
import scheme2 from "../../src/assets/scheme2.png";
import scheme3 from "../../src/assets/scheme3.png";

function bigIconStyle(color) {
  return {
    fontSize: "2.5rem",         // Large icon size
    color,
    background: "#eaf6fd",       // Soft background circle
    borderRadius: "50%",
    padding: "16px",
    marginBottom: "0px",
    boxShadow: "0 2px 8px rgba(33,150,243,0.09)"
  };
}

const schemes = [
  {
    title: "PM Awas Yojana",
    description: "Affordable housing scheme for all sections of society.",
    image: scheme1,
  },
  {
    title: "Digital India",
    description: "Transforming India into a digitally empowered society.",
    image: scheme2,
  },
  {
    title: "Skill India Mission",
    description: "Enhancing employability through skill development programs.",
    image: scheme3,
  },
];



export default function InfoHub() {
  const [carouselIdx, setCarouselIdx] = React.useState(0);
  const itemsPerView = 3;
  const [hoverStates, setHoverStates] = React.useState([false, false, false]);
  const [carouselHover, setCarouselHover] = React.useState([false, false, false]);

  const green = "#17943a";
  const darkGreen = "#13702c";
  const border = "#d1e7dd";
  const cardBg = "#fff";
  const tipBg = "#f6fef2";
  const shadow = "0 2px 8px rgba(23,148,58,0.08)";
  const cardHoverShadow = "0 8px 24px rgba(23,148,58,0.17)";
  const btnHoverBg = "#25ce53";

  const prev = () => {
    setCarouselIdx(carouselIdx === 0 ? schemes.length - itemsPerView : carouselIdx - 1);
  };

  const next = () => {
    setCarouselIdx(carouselIdx >= schemes.length - itemsPerView ? 0 : carouselIdx + 1);
  };

  return (
    <div style={{ background: "#fff", minHeight: "100vh", width: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column" }}>
      <main style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: "38px 22px 0 22px",
        flex: 1,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>
        {/* Header */}
        <div style={{ width: "100%", marginBottom: "8px", textAlign: "left" }}>
          <h1 style={{
            fontSize: "2.35rem",
            fontWeight: 700,
            color: green,
            margin: "0 0 2px 0",
            letterSpacing: "0.5px"
          }}>
            Information Hub
          </h1>
          <div style={{
            fontWeight: 400,
            fontSize: "1.05rem",
            color: "#555",
            marginBottom: "23px"
          }}>
            Your comprehensive resource for understanding and using CivicSecure
          </div>
        </div>

        {/* Policies */}
        <section style={{ width: "100%", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
            <span style={{ fontWeight: 700, fontSize: "1.20rem", color: green, marginRight: "auto" }}>
              Latest Government Schemes & Policies
            </span>
            <button
              style={{
                background: green,
                color: "#fff",
                border: "none",
                fontSize: 15,
                padding: "7px 22px",
                borderRadius: 7,
                cursor: "pointer",
                boxShadow: shadow,
                fontWeight: 600,
                transition: "background 0.15s"
              }}
              onMouseEnter={e => (e.currentTarget.style.background = btnHoverBg)}
              onMouseLeave={e => (e.currentTarget.style.background = green)}
              onClick={() => alert("Navigate to all schemes")}
            >
              View All
            </button>
          </div>
          {/* Policies Carousel - 3 cards centered */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 18,
            marginBottom: 10
          }}>
            <button
              onClick={prev}
              style={arrowBtnStyle(green, shadow)}
              aria-label="Previous Schemes"
              onMouseEnter={e => (e.currentTarget.style.background = btnHoverBg)}
              onMouseLeave={e => (e.currentTarget.style.background = green)}
            >&lt;</button>
            <div style={{ display: "flex", gap: 16 }}>
              {schemes.concat(schemes).slice(carouselIdx, carouselIdx + itemsPerView).map((scheme, idx) => (
                <div
                  key={scheme.title + idx}
                  style={{
                    background: cardBg,
                    borderRadius: "13px",
                    boxShadow: carouselHover[idx] ? cardHoverShadow : shadow,
                    width: 250,
                    minWidth: 165,
                    position: "relative",
                    overflow: "hidden",
                    border: `1.3px solid ${border}`,
                    display: "flex",
                    flexDirection: "column",
                    cursor: "pointer",
                    transition: "box-shadow .22s, transform .15s",
                    transform: carouselHover[idx] ? "translateY(-4px) scale(1.03)" : "none"
                  }}
                  onMouseEnter={() => setCarouselHover([idx === 0, idx === 1, idx === 2])}
                  onMouseLeave={() => setCarouselHover([false, false, false])}
                >
                  <img
                    src={scheme.image}
                    alt={scheme.title}
                    style={{
                      width: "100%",
                      height: "95px",
                      objectFit: "cover",
                      borderTopLeftRadius: "13px",
                      borderTopRightRadius: "13px"
                    }}
                  />
                  <div style={{ padding: "11px 12px 8px 13px", minHeight: 40, flex: 1 }}>
                    <div style={{ fontWeight: 700, color: green, fontSize: "1rem", marginBottom: 3 }}>
                      {scheme.title}
                    </div>
                    <div style={{ color: "#234f25", fontSize: ".9rem" }}>{scheme.description}</div>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={next}
              style={arrowBtnStyle(green, shadow)}
              aria-label="Next Schemes"
              onMouseEnter={e => (e.currentTarget.style.background = btnHoverBg)}
              onMouseLeave={e => (e.currentTarget.style.background = green)}
            >&gt;</button>
          </div>
          {/* Tip */}
          <div style={{
            width: "100%",
            maxWidth: "830px",
            margin: "10px auto 0 auto",
            background: tipBg,
            borderRadius: "8px",
            color: darkGreen,
            boxShadow: shadow,
            fontSize: "0.99rem",
            padding: "8px 14px",
            textAlign: "center",
            fontWeight: 500,
            border: `1px solid ${border}`,
          }}>
            <span role="img" aria-label="Tip">💡</span> Tip: Stay updated with these schemes to unlock benefits for you and your community!
          </div>
        </section>

        {/* Info Cards */}
        <section style={{
          display: "flex",
          gap: 16,
          justifyContent: "center",
          marginTop: 24,
          marginBottom: 18,
          flexWrap: "wrap",
          width: "100%",
        }}>
          {[
            {
              icon: <FaBook style={{ ...iconStyle,fontSize: '2.5rem' , color: green }} />,
              title: "User Guide",
              body: "Step-by-step instructions on how to submit complaints, track status, and use all features of CivicSecure.",
              btn: "Read Guide",
            },
            {
              icon: <FaQuestionCircle style={{ ...iconStyle,  fontSize: '2.5rem' , color: green }} />,
              title: "FAQs",
              body: "Find answers to commonly asked questions about the grievance redressal process and platform usage.",
              btn: "View FAQs",
            },
            {
              icon: <FaExclamationTriangle style={{ ...iconStyle,fontSize: '2.5rem' , color: green }} />,
              title: "Emergency Protocols",
              body: "Important information about what to do in emergency situations and how to quickly get help.",
              btn: "Learn More",
            }
          ].map((card, idx) => (
            <div
              key={card.title}
              style={{
                ...infoCardStyle(green, darkGreen, cardBg, border, shadow),
                boxShadow: hoverStates[idx] ? cardHoverShadow : shadow,
                border: `1.3px solid ${green}`,
                cursor: "pointer",
                transform: hoverStates[idx] ? "translateY(-3px) scale(1.03)" : "none",
                transition: "box-shadow .18s, transform .13s"
              }}
              onMouseEnter={() => setHoverStates([idx === 0, idx === 1, idx === 2])}
              onMouseLeave={() => setHoverStates([false, false, false])}
            >
              {card.icon}
              <div style={cardTitleStyle(darkGreen)}>{card.title}</div>
              <div style={cardBodyStyle}>{card.body}</div>
              <button
                style={{
                  ...buttonStyleGreen,
                  fontSize: "0.99rem",
                  padding: "7px 0",
                  width: "80%",
                  margin: "0 auto",
                  transition: "background 0.12s"
                }}
                onMouseEnter={e => (e.currentTarget.style.background = btnHoverBg)}
                onMouseLeave={e => (e.currentTarget.style.background = green)}
              >
                {card.btn}
              </button>
            </div>
          ))}
        </section>
      </main>

      {/* Footer */}
      <footer style={{
        width: "100%",
        background: "#fff",
        borderTop: `1px solid ${border}`,
        padding: "12px 0 8px 0",
        marginTop: "auto"
      }}>
        <div style={{
          maxWidth: 900,
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap"
        }}>
          <div style={{ fontWeight: 700, fontSize: "1.05rem", color: darkGreen, marginBottom: 5 }}>
            Contact Support
          </div>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 36,
            flexWrap: "wrap"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <FaPhone style={{ color: green, fontSize: 18 }} />
              <div>
                <div style={{ fontSize: "0.94rem", color: "#345f34" }}>Helpline</div>
                <div style={{ fontWeight: 600 }}>
                  1800-XXX-XXXX <span style={{ color: "#555", fontWeight: 400 }}>(Toll-free)</span>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <FaEnvelope style={{ color: green, fontSize: 18 }} />
              <div>
                <div style={{ fontSize: "0.94rem", color: "#345f34" }}>Email</div>
                <div style={{ fontWeight: 600 }}>support@civicsecure.gov.in</div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Styles
const arrowBtnStyle = (bg, shadow) => ({
  background: bg,
  color: "#fff",
  border: "none",
  borderRadius: "50%",
  width: 34,
  height: 34,
  fontSize: "1.17rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: shadow,
  cursor: "pointer",
  transition: "background 0.18s",
  fontWeight: 700
});
const infoCardStyle = (borderColor, titleColor, bg, border, shadow) => ({
  background: bg,
  borderRadius: 11,
  padding: "18px 13px 16px 13px",
  textAlign: "center",
  flex: "1 0 210px",
  minWidth: 160,
  maxWidth: 320,
  border: `1.4px solid ${borderColor}`,
  boxShadow: shadow,
  margin: "0 0 0 0",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start"
});
const iconStyle = {
  fontSize: "1.86rem",
  marginBottom: 9,
  borderRadius: "50%",
  background: "#f0fef3",
  padding: "6px"
};
const cardTitleStyle = (color) => ({
  fontSize: "1.04rem",
  fontWeight: 700,
  marginBottom: 6,
  color,
  letterSpacing: ".2px"
});
const cardBodyStyle = {
  color: "#284829",
  marginBottom: 10,
  fontSize: ".89rem",
  fontWeight: 400,
  minHeight: "39px"
};
const buttonStyleGreen = {
  background: "#17943a",
  color: "#fff",
  border: "none",
  borderRadius: 7,
  padding: "7px 19px",
  fontWeight: 700,
  fontSize: "0.99rem",
  cursor: "pointer",
  marginTop: 4,
  boxShadow: "0 2px 8px rgba(60,160,60,0.07)"
};



