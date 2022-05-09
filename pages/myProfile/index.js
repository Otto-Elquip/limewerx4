import { useState , useEffect} from "react";
import Profile from './profile';

export default function Home(){
    const [user, setUser] = useState(null)

        return(
            <div>
                <Profile/>
            </div>

        )
}