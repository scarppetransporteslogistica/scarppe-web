export default function MapEmbed({ lat, lng, label }) {
  const src = `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
  return (
    <div className="border border-black/10">
      <iframe
        title={`Mapa ${label}`}
        src={src}
        width="100%"
        height="300"
        style={{ border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
