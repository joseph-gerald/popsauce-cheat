document.documentElement.style.overflowY = 'hidden';
document.body.style.overflowY = 'hidden';

document.body.animate([
    { width: '0vw', height: '0px' },
    { width: '500px', height: '300px' }
], {
    duration: 300,
    easing: 'ease-in-out',
    fill: 'forwards'
})

document.documentElement.animate([
    { width: '0vw', height: '0px' },
    { width: '500px', height: '100px' }
], {
    duration: 500,
    easing: 'ease-in-out',
    fill: 'forwards'
})