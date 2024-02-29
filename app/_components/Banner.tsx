export default function Banner() {
  return (
    <video autoPlay loop muted className="h-full w-full object-cover">
      <source src="./banner.webm" type="video/webm" />
    </video>
  );
}
