const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.[0]) return null;
  const d = payload[0].payload;
  // Only show tooltip for main data points (which have disaster_type)
  if (!d.disaster_type) return null;
  return (
    <div style={{
      backgroundColor: 'rgba(255, 255, 255, 1)',
      color: 'black',
      padding: '16px',
      borderRadius: '4px',
      border: '1px solid #d1d5db',
      width: '384px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      fontFamily: 'Arial, sans-serif',
      fontSize: '18px'
    }}>
      <p style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '8px' }}>
        {d.disaster_type} in {d.country}
      </p>
      <p style={{ fontStyle: 'italic', marginBottom: '8px' }}>
        Start year: {d.start_year}
      </p>
      {d.summary && (
        <p style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #e5e7eb', whiteSpace: 'pre-line', lineHeight: '1.6' }}>
          {d.summary}
        </p>
      )}
    </div>
  );
};

export default CustomTooltip;




