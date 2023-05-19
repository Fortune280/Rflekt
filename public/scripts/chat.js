const video = document.querySelector('.back-video')
video.addEventListener("timeupdate", function(){
    if(this.currentTime >= 0 * 60) {
    this.pause();
    }
});

