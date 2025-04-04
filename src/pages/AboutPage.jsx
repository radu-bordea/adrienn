import React from "react";

const AboutPage = () => {
  return (
    <div className="container mx-auto p-6 mt-10 text-gray-400">
      <h1 className="text-3xl font-bold mb-6">About Me</h1>

      {/* Paragraph 1 */}
      <p className="mb-4 text-lg">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur
        pretium turpis sed urna feugiat, non tincidunt lectus facilisis.
        Suspendisse potenti. Mauris malesuada augue vel eros congue, at
        venenatis nisi mollis. Sed hendrerit, neque in lacinia blandit, nunc sem
        iaculis enim, sit amet tincidunt augue eros nec dui. Aenean sit amet
        scelerisque nisl, non scelerisque enim.
      </p>

      {/* Paragraph 2 */}
      <p className="mb-4 text-lg">
        Aliquam erat volutpat. Nam aliquam vel urna in tristique. Ut viverra,
        sapien vitae bibendum convallis, sem leo ultricies neque, ac faucibus
        dui arcu id elit. Integer sit amet erat ante. Sed euismod dolor sit amet
        diam volutpat, eget ultricies nulla rhoncus. Morbi cursus metus neque,
        sit amet lacinia ipsum pharetra et. Nulla vitae mi sed nunc lobortis
        tempus.
      </p>

      {/* Paragraph 3 */}
      <p className="mb-4 text-lg">
        Phasellus congue dolor ac odio tristique mollis. In vel purus nec nulla
        efficitur feugiat. Ut ac urna et lacus laoreet tincidunt id id libero.
        Quisque convallis purus sapien, ac aliquam libero placerat ut. Donec
        vehicula velit et malesuada suscipit. Cras varius sem ut turpis
        sollicitudin varius. Aenean et ante vel lacus consequat pretium sit amet
        id mi.
      </p>
    </div>
  );
};

export default AboutPage;
