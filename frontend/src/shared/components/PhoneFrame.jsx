import "./PhoneFrame.css";

export default function PhoneFrame({ children }) {
  return (
    <div className="phone-wrapper">
      <div className="phone-frame">{children}</div>
    </div>
  );
}