
import Swal from "sweetalert2";

export const Alert = async ({ icon, title, message, confirmButtonText, isDispatch, onFunction }) => {
    if (isDispatch) {
        return await Swal.fire({
            icon: icon,
            title: title,
            text: message,
            confirmButtonText: confirmButtonText ?? 'OK',
        }).then((result) => {
            if (result.isConfirmed) {
                onFunction()
            }
        });
    } else {
        return await Swal.fire({
            icon: icon,
            title: title,
            text: message,
            confirmButtonText: confirmButtonText ?? 'OK',
        })
    }
}

