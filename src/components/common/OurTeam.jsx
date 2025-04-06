import React from "react";
import raman from "../../assets/raman.jpg";
import toshika from "../../assets/toshika.jpg";
import vaibhav from "../../assets/vaibhav.png";

const teamMembers = [
  {
    name: "Vaibhav Tyagi",
    role: "Developer",
    image: vaibhav,
    socials: [
      { platform: "linkedin", link: "https://www.linkedin.com/in/vaibhavtyagi01?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BXPa1T%2FfcTayMzX33zGe1xA%3D%3D" },
      { platform: "instagram", link: "https://www.instagram.com/vaibhav.tyagi01?igsh=MWx5MXVyMnk2NW5lbw==" },
    ],
    position: "top-left",
  },
  {
    name: "Raman Chauhan",
    role: "Developer",
    image: raman,
    socials: [
      { platform: "linkedin", link: "https://www.linkedin.com/in/ramanchauhan13?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BEMXM4gtCTDyS06RWLN0UpA%3D%3D" },
      { platform: "instagram", link: "https://www.instagram.com/__life_of_an_athlete__?utm_source=qr&igsh=MThvZnpxc3lmcWRyMA==" },
    ],
    position: "center",
  },
  {
    name: "Toshika Varshney",
    role: "UI Designer",
    image: toshika,
    socials: [
      { platform: "linkedin", link: "https://www.linkedin.com/in/toshika-varshney-9a9b87280?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BHdHeL5jhS7ukTuKJ7yTNGw%3D%3D" },
      { platform: "instagram", link: "https://www.instagram.com/toshi.ka_?igsh=eHhud25rNjhoaXc5" },
    ],
    position: "bottom-right",
  },
];

function OurTeam() {
  return (
    <div className="text-start bg-white h-[90vh] relative">
      <h2 className="text-4xl pl-6 py-2 font-bold text-orange-600">Our Team</h2>
      <div className="relative w-full h-[500px] flex justify-center">
        <div className="absolute w-full h-1/4 bg-orange-500 top-2/4 -translate-y-1/2"></div>
        <div className="relative w-full h-full flex items-center justify-center">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className={`bg-gray-200 rounded-lg shadow-lg p-5 w-60 h-65 text-center absolute ${
                member.position === "top-left" ? "top-18 left-40" :
                member.position === "center" ? "top-2/4 left-1/2 -translate-x-1/2 -translate-y-1/2" :
                "bottom-20 right-40"
              }`}
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-full rounded-lg mx-auto object-cover border-4 border-gray-100"
              />
              <h3 className="text-lg font-semibold mt-8">{member.name}</h3>
              <p className="text-gray-600 pb-1 text-sm">{member.role}</p>
              <div className="flex justify-center gap-3 text-orange-600">
                {member.socials.map((social, i) => (
                  <a 
                    key={i} 
                    href={social.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="cursor-pointer text-xl hover:text-orange-700"
                  >
                    <i className={`fab fa-${social.platform}`}></i>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default OurTeam;
