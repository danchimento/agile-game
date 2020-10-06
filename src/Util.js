const px = value => `${value}px`;
const val = value => {
    if (value.toString().indexOf('px') >= 0) {
        return parseInt(value.replace('px', ''));
    } else {
        return parseInt(value);
    }
}

const rand = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export {
    px,
    val,
    rand
}