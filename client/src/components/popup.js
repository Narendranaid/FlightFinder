function Popup({ message, type, onClose }) {
  if (!message) return null;

  return (
    <div style={overlayStyle}>
      <div style={{
        ...popupStyle,
        borderLeft: type === "error" ? "5px solid #dc3545" : "5px solid #28a745"
      }}>
        <p style={{ marginBottom: "15px" }}>{message}</p>
        <button className="btn btn-light btn-sm" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999
};

const popupStyle = {
  backgroundColor: "#2c2f36",
  color: "white",
  padding: "20px 30px",
  borderRadius: "8px",
  minWidth: "300px",
  textAlign: "center",
  boxShadow: "0 0 20px rgba(0,0,0,0.5)"
};

export default Popup;
