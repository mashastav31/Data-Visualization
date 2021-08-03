import { useHistory } from "react-router-dom";

export default function Item(){
    let history = useHistory();
    return (
        <>
          <button onClick={() => history.goBack()} className={'backBtn'}>
            Back
            </button>
        </>
    );
};
