import { Suspense } from "react";
import { Loader } from "react-feather";
import CouponsTable from "./table";

const Coupons = () => {
    return (
        <>
            <Suspense fallback={<Loader/>}>
                <CouponsTable/>
            </Suspense>
        </>
    )
}
export default Coupons;