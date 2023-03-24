import AddToCalendarLib from '@culturehq/add-to-calendar';
import { useQuery } from "@apollo/react-hooks";
import { getFinalizedOrder } from "../../../../api/SuccessAPI";
import './AddToCalendar.css'

const AddToCalendar = (props) => {
    const orderId = props.orderId
    const {loading, data, error } = useQuery(getFinalizedOrder, {
        variables: { orderId },
      });
    return !loading && !error && data && (
        <AddToCalendarLib event={
            {
                name: "Pepe's Bubbles Pickup",
                details: "Pickup order " + orderId,
                location: data.finalizedOrder.location.name,
                startsAt: data.finalizedOrder.readyDate,
                endsAt: data.finalizedOrder.readyDate
            }
        } />
    );
}

export default AddToCalendar;