function startMove(dom, attrObj, callback) {
    clearInterval(dom.timer);
    var iSpeed = null,
        iCur = null;
    dom.timer = setInterval(function () {
        var bStop = true;
        for (var attr in attrObj) {
            // 'width' 'height' 
            if (attr == 'opacity') {
                iCur = parseFloat(getStyle(dom, attr)) * 100;
            } else {
                iCur = parseInt(getStyle(dom, attr));
            }
            iSpeed = (attrObj[attr] - iCur) / 7;
            iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
            if (attr == 'opacity') {
                dom.style.opacity = (iCur + iSpeed) / 100;
            } else {
                dom.style[attr] = iCur + iSpeed + 'px';
            }
            if (iCur != attrObj[attr]) {
                bStop = false;
            }
        }
        if (bStop) {
            clearInterval(dom.timer);
            typeof callback == 'function' && callback();
        }
    }, 30);
}

function getStyle(dom, attr) {
    if (window.getComputedStyle) {
        return window.getComputedStyle(dom, null)[attr];
    } else {
        return dom.currentStyle[attr];
    }
}

var timer = null;
var sliderPage = document.getElementsByClassName('sliderPage')[0];
var moveWidth = sliderPage.children[0].offsetWidth;
var num = sliderPage.children.length - 1;
var leftBtn = document.getElementsByClassName('leftBtn')[0];
var rightBtn = document.getElementsByClassName('rightBtn')[0];
var oSpanArray = document.getElementsByClassName('sliderIndex')[0].getElementsByTagName('span');
var lock = true;
var index = 0;

leftBtn.onclick = function () {
    autoMove('right->left')
}
rightBtn.onclick = function () {
    autoMove('left->right')
}

for (var i = 0; i < oSpanArray.length; i++) {
    (function (myIndex) {
        oSpanArray[i].onclick = function () {
            lock = false;
            clearTimeout(timer);
            index = myIndex;
            startMove(sliderPage, {
                left: -index * moveWidth
            }, function () {
                lock = true;
                setTimeout(autoMove, 1500);
                changeIndex(index);
            })

        }
    })(i)
}

//direction 默认轮播方向是从左到右
// 点击向左的按钮将会从右向左
function autoMove(direction) {

    if (lock) {
        lock = false;
        clearTimeout(timer);
        if (!direction || direction == 'left->right') {
            // console.log('over');
            index++;
            startMove(sliderPage, {
                left: sliderPage.offsetLeft - moveWidth
            }, function () {
                if (sliderPage.offsetLeft == -num * moveWidth) {
                    index = 0;
                    sliderPage.style.left = '0px';
                }
                timer = setTimeout(autoMove, 1500);
                lock = true;
                changeIndex(index);
            })
        } else if (direction == 'right->left') {
            if (sliderPage.offsetLeft == 0) {
                sliderPage.style.left = -num * moveWidth + 'px';
                index = num;
            }
            index--;
            startMove(sliderPage, {
                left: sliderPage.offsetLeft + moveWidth
            }, function () {
                timer = setTimeout(autoMove, 1500);
                lock = true;
                changeIndex(index);
            })
            // console.log(index)
        }
    }
}


function changeIndex(index) {
    for (var j = 0; j < oSpanArray.length; j++) {
        oSpanArray[j].className = '';
    }

    oSpanArray[index].className = 'active';
}
timer = setTimeout(autoMove, 1500);

