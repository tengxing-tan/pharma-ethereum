// there is no type definition for ethereum in window object
// so we need to declare it
declare global {
    interface Window {
        ethereum?: any;
    }
}
