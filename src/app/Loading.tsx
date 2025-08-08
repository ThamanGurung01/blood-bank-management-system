const Loading = () => {
    return (
      <div className="flex h-[70vh] items-center justify-center w-full">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-red-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
}

export default Loading