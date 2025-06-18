import { lazy, Suspense } from "react";
import Loader from '../../../Loader/Loader';

const LazyComponent = lazy(() => import("./Transactions"));

const Transactions = () => {
  return (
    <Suspense fallback={<Loader />}>
      <LazyComponent />
    </Suspense>
  );
};

export default Transactions;