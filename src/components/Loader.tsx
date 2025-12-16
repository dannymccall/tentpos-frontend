
const LoadingAnimation = () => {
  const bars = [0, 1, 2, 3];

  const barStyle = (i:any) => ({
    backgroundColor: 'rgb(32,50,68)',
    height: '20px',
    width: '5px',
    borderRadius: '50px',
    animation: 'loader 1s infinite ease-in-out',
    animationDelay: `${i * 0.1}s`
  });

  const containerStyle = {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '5px',
    marginTop:"20px"
  };

return (
    <>
      <style>
        {`
          @keyframes loader {
            0%, 100% {
              height: 30px;
              background-color:rgb(32,50,68);
            }
            50% {
              height: 60px;
              background-color: rgb(120, 120, 120);
            }
          }
        `}
      </style>

      <div style={containerStyle}>
        {bars.map((_, i) => (
          <div key={i} style={barStyle(i)}></div>
        ))}
      </div>
    </>
  );
};

export default LoadingAnimation;
