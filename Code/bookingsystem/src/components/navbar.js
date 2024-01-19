export default function Navbar() {
    return (
      <>
        <div>
            <nav className="flex space-x-4">
                <span className="flex w-max">Locations</span>
                <span className="flex w-max">Company</span>
                <span className="flex space-x-4 w-max">
                    <div>You/login</div>
                    <div>Menu</div>
                </span>
            </nav>
        </div>
      </>
    )
  }