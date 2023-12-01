import { ConfigurableZoraEditionInput } from "@/hooks/useCreateZoraEdition";
import { CreateBoardPost } from "./client";

const fetchDropTemplate = async (name: string): Promise<ConfigurableZoraEditionInput> => {
    return {
        name: "",
        symbol: "MGMT",
        editionSize: "open",
        royaltyBPS: "zero",
        description: "",
        animationURI: "",
        imageURI: "",
        saleConfig: {
            publicSalePrice: "free",
            publicSaleStart: "now",
            publicSaleEnd: "forever",
        },
    }
}



export default async function Page({ params }: { params: { name: string } }) {
    const dropTemplate = await fetchDropTemplate(params.name);

    return (
        <div className=" flex flex-col gap-6 w-full md:w-10/12 m-auto mt-4 mb-16 p-4">
            <CreateBoardPost referrer='' templateConfig={dropTemplate} />
        </div>
    )


}