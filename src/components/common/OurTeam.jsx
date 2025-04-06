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
      { platform: "linkedin", link: "https://www.linkedin.com/in/vaibhavtyagi01" },
      { platform: "instagram", link: "https://www.instagram.com/vaibhav.tyagi01" },
    ],
  },
  {
    name: "Raman Chauhan",
    role: "Developer",
    image: raman,
    socials: [
      { platform: "linkedin", link: "https://www.linkedin.com/in/ramanchauhan13" },
      { platform: "instagram", link: "https://www.instagram.com/__life_of_an_athlete__" },
    ],
  },
  {
    name: "Toshika Varshney",
    role: "UI Designer",
    image: toshika,
    socials: [
      { platform: "linkedin", link: "https://www.linkedin.com/in/toshika-varshney-9a9b87280" },
      { platform: "instagram", link: "https://www.instagram.com/toshi.ka_" },
    ],
  },
];

function OurTeam() {
  return (
    <div className="text-start bg-white py-10 px-4 md:px-10">
      <h2 className="text-3xl md:text-4xl font-bold text-orange-600 mb-8">Our Team</h2>
      <div className="flex flex-col items-center md:flex-row md:justify-center md:gap-10 gap-8">
        {teamMembers.map((member, index) => (
          <div
            key={index}
            className="bg-gray-200 rounded-lg shadow-lg p-5 w-72 sm:w-60 flex flex-col items-center"
          >
            <img
              src={member.image}
              alt={member.name}
              className="w-40 h-40 rounded-full object-cover border-4 border-gray-100 mb-4"
            />
            <h3 className="text-lg font-semibold">{member.name}</h3>
            <p className="text-gray-600 text-sm">{member.role}</p>
            <div className="flex justify-center gap-4 mt-2 text-orange-600">
              {member.socials.map((social, i) => (
                <a
                  key={i}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xl hover:text-orange-700"
                >
                  <i className={`fab fa-${social.platform}`}></i>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OurTeam;
