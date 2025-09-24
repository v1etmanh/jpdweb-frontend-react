



const VideoPlayer = ({ videoUrl }) => {
  return (
    <div>
     <video width="100%" height="400" controls>
      <source src={videoUrl} type="video/mp4" />
      Trình duyệt của bạn không hỗ trợ video.
    </video>
    </div>
  );
};

export default VideoPlayer;