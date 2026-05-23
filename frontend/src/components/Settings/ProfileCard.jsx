const ProfileCard = () => {
  return (

    <div className="space-y-6">

      {/* PROFILE CARD */}

      <div
        className="bg-[#0B1120]
        border border-orange-500/10
        rounded-2xl p-6"
      >

        <div className="flex flex-col items-center">

          <img
            src="https://i.pravatar.cc/150?img=12"
            alt="avatar"
            className="w-24 h-24 rounded-full
            border-4 border-orange-500"
          />

          <h2 className="text-2xl font-bold mt-4 text-white">
            Anand S
          </h2>

          <p className="text-gray-400 text-sm mt-1">
            fraudguard@security.ai
          </p>

        </div>

      </div>

      {/* TEAM CARD */}

      <div
        className="bg-[#0B1120]
        border border-orange-500/10
        rounded-2xl p-5"
      >

        <h3
          className="text-sm tracking-[3px]
          text-orange-400 mb-5"
          style={{ fontFamily: "Orbitron" }}
        >

          DEVELOPED BY TEAM DURAI

        </h3>

        <div
          className="space-y-4 text-gray-300"
          style={{ fontFamily: "Poppins" }}
        >

          <div>

            <p className="text-xs text-gray-500 mb-3 tracking-widest">
              DEVELOPERS
            </p>

            <div className="space-y-2">

              <p className="text-sm hover:text-orange-400 transition-all">
                ASWIN K
              </p>

              <p className="text-sm hover:text-orange-400 transition-all">
                ANAND SWARUP
              </p>

              <p className="text-sm hover:text-orange-400 transition-all">
                SHREY SINGH
              </p>

              <p className="text-sm hover:text-orange-400 transition-all">
                MOHITH RAJ
              </p>

            </div>

          </div>

          <div className="pt-4 border-t border-orange-500/10">

            <p className="text-xs text-gray-500 mb-2 tracking-widest">
              CONTACT
            </p>

            <p className="text-orange-400 text-sm break-all">
              Durai_MAAS_2026@gmail.com
            </p>

          </div>

        </div>

      </div>

    </div>

  );
};

export default ProfileCard;