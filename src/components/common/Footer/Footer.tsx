type Props = {};

export default function Footer({}: Props) {
    return (
        <div className="fixed bottom-0 bg-[#0D0D0D] w-full">
            <div className="flex justify-between py-[1.81rem] mx-[24rem]  border-b border-[#FF9F0D]">
                <div>
                    <div className="flex flex-row text-2xl font-bold">
                        <p className="text-[#FF9F0D]">St</p>
                        <p className="text-[#FFF]">
                            ill You Need Our Support ?
                        </p>
                    </div>
                    <p className="text-[#FFF] mt-2 text-base">
                        Contact our admin at admin@midtaste.com
                    </p>
                </div>
                <div className="text-base">
                    <div className="flex mt-1">
                        <p className="text-[#FF9F0D]">Address</p>
                        <p className="text-[#FFF]">
                            : 531 Tran Phu Street, Hatinh City
                        </p>
                    </div>
                    <div className="flex mt-1">
                        <p className="text-[#FF9F0D]">Hotline</p>
                        <p className="text-[#FFF]">: 0911095607</p>
                    </div>
                </div>
            </div>
            <div>
                <p>123</p>
            </div>
        </div>
    );
}
