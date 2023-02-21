



export default function Sidebar() {

    return (

        <div className="text-3xl text-green-600 p-2">
            <div className="relative flex items-center justify-center 
                        h-12 w-12 mt-2 mb-2 mx-auto  
                    bg-gray-400 hover:bg-green-600 dark:bg-gray-800 
                    text-green-500 hover:text-white
                        hover:rounded-xl rounded-3xl
                        transition-all duration-300 ease-linear
                        cursor-pointer shadow-lg">
                <p>-</p>
            </div>
            <div className="relative flex items-center justify-center 
                        h-12 w-12 mt-2 mb-2 mx-auto  
                    bg-gray-400 hover:bg-green-600 dark:bg-gray-800 
                    text-green-500 hover:text-white
                        hover:rounded-xl rounded-3xl
                        transition-all duration-300 ease-linear
                        cursor-pointer shadow-lg">
                <p>+</p>
            </div>

        </div>
    );


}