const callNowIntervel = setInterval(calledNow, 1000);
const newFunctionIntervel = setInterval(newFunction, 1000);
function calledNow () {
    console.log('called')
    const element = document.querySelector('.cMFuDJ')
    console.log(element)
    const close = document.querySelector('.fFpYRP')
    if (element && close) {
        const newDiv = document.createElement('div')
        newDiv.classList.add('heading','d-flex','justify-content-between','align-items-center','headingModel')
        newDiv.innerHTML = `
            <div>
                <img src="/images/modelHeading.png" class="img-fluid image-heading">
            </div>
            <h2 class="text-white m-0">Connect Wallet</h2>
            <div>
                <h2 class="fw-bold display-5 text-white closeModel"  style="cursor:pointer">&times;</h2>
            </div>

        `
        console.log(newDiv)
        element.appendChild(newDiv)
        clearInterval()
        if (close) {
            document.querySelector('.closeModel').addEventListener('click',() => {
                close.click()
            })
        }
        clearInterval(callNowIntervel)
    }
}
function newFunction() {
    const connectButton = document.querySelector('.buttonOnline')
    connectButton.addEventListener('click',() => {
        calledNow()
    })
}

