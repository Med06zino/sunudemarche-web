import logo from "../assets/logo.png.png";

export default function Logo({ className = "h-10" }) {
  return <img src={logo} alt="SunuDémarche" className={`${className} object-contain`} />;
}
