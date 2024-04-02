
const Redirect = ({testF,getF}) => {
    getF();
    testF();
    getF();
    return (
        <div>Redirect page</div>
    )
}
export default Redirect