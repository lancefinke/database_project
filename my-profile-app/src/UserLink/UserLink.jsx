import { Link } from "react-router-dom";
import './UserLink.css';

const UserLink = ({text,userName}) =>{
    return(
        <Link className="user-link" to={`/profile/?name=${userName}`}>{text}</Link>
    );
}

export default UserLink;