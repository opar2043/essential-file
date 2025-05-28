import { useQuery } from "@tanstack/react-query";

import usePublic from "./usePublic";

const usePayment = () => {
  const axiosSecure = usePublic();
  const {data: payments ,refetch,isLoading} = useQuery({
    queryKey: ["payments"],
    queryFn: async () => {
      const res = await axiosSecure.get("/payments");
      return res.data;
    },
  });
  
  return [payments, refetch, isLoading];
};

export default usePayment;
