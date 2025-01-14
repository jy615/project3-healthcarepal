import { useState, useEffect } from 'react'
import { Table } from 'react-bootstrap'
import HeaderFunction from './Header'
import { useNavigate, useLocation } from 'react-router-dom';
import ToastElement from '../Toast';

export default function AdminHome () {

    const [apptData, setApptData] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const [toastStatus, setToastStatus] = useState(false); 

    useEffect(() => {
        if(location?.state?.msg){
            setToastStatus(true);
        }

        fetch('/api/apptsummary/all')
            .then((response) => response.json())
            .then((data) => {
                if(data.msg === "server error"){
                    return navigate("/signin");
                } else if(data.msg === "Not Authorized!"){
                    return navigate("/");
                }
                data.sort((a,b) => {
                    if (a.date < b.date) {
                        return -1;
                    }
                    if (a.date > b.date) {
                        return 1;
                    }
                    if (a.date.slice(0,10) === b.date.slice(0,10)){
                        if (a.time < b.time) {
                            return -1;
                        }
                        if (a.time > b.time) {
                            return 1;
                        }
                    }

                    return 0;
                });
                setApptData(data);
            });
    }, [])

    const handleClick = (appt) => () => {
        navigate(`/admin/userAppointment/${appt._id}`);
    }

    const apptElement = apptData.map((element, index) => {
        return(
            <tr className='clickable-row' onClick={handleClick(element)} key={index} style={{ cursor: "pointer" }}>
                <th scope="row">{index + 1}</th>
                <td>{element?.date.slice(0,10)}</td>
                <td>{element?.loginInfo?.firstname} {element?.loginInfo?.lastname}</td>
                <td>{element?.loginInfo?.email}</td>
                <td>{element?.purpose}</td>
                <td>{element?.time}</td>
                <td>{parseInt(element?.time.slice(0,2)) < 12 ? "AM" : "PM"}</td>
                <td className='text-center'>{element?.apptCompleted ? "✓" : ""}</td>
            </tr>
        )
    });

    const toast = <ToastElement msg={location?.state?.msg} />;

    return (
        <>
            <HeaderFunction />
            <div className="toast-container position-fixed bottom-0 end-0 p-3" style={{zIndex: 11}}>
                {toastStatus ? toast : ""}
            </div>
            <div className="card m-5 p-2">
                <div className="card-body">
                    <div className='text-center m-3 mb-5'>
                        <h3 >Appointment List</h3>
                        <p className='text-secondary'>Click individual appointment for details</p>
                    </div>
                    <Table className="table table-hover">
                        <thead>
                            <tr>
                                <th scope="col">No.</th>
                                <th scope="col">Appt. Date</th>
                                <th scope="col">Full Name</th>
                                <th scope="col">Email</th>
                                <th scope="col">Appt. Type</th>
                                <th scope="col">Appt. Time</th>
                                <th scope="col">AM/PM</th>
                                <th scope="col" className='text-wrap text-center' style={{width: "6rem"}}>Appt. Completed?</th>
                            </tr>
                        </thead>
                        <tbody>
                            {apptElement}
                        </tbody>
                    </Table>
                </div>
            </div>
        </>
    )
}