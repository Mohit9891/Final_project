const REMOTIVE_BASE = "https://remotive.com/api/remote-jobs";
const Arbeitnow_BASE = "https://www.arbeitnow.com/api/job-board-api";

const searchJobs = async (req, res) => {
  try {
    const { query, page = 1 } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const results = [];

    // Source 1: Remotive (remote jobs, no key needed)
    try {
      const remotiveRes = await fetch(
        `${REMOTIVE_BASE}?search=${encodeURIComponent(query)}&limit=20`
      );
      if (remotiveRes.ok) {
        const remotiveData = await remotiveRes.json();
        const remotiveJobs = (remotiveData.jobs || []).map((job) => ({
          id: `remotive-${job.id}`,
          title: job.title,
          company: job.company_name,
          companyLogo: job.company_logo,
          location: job.candidate_required_location || "Remote",
          employmentType: job.job_type || "remote",
          salary: job.salary || null,
          description: job.description,
          applyUrl: job.url,
          source: "Remotive",
          postedAt: job.publication_date,
          isRemote: true,
          skills: [],
          tags: job.tags || [],
        }));
        results.push(...remotiveJobs);
      }
    } catch (e) {
      console.error("Remotive error:", e.message);
    }

    // Source 2: Arbeitnow (worldwide jobs, no key needed)
    try {
      const arbeitRes = await fetch(
        `${Arbeitnow_BASE}?search=${encodeURIComponent(query)}`
      );
      if (arbeitRes.ok) {
        const arbeitData = await arbeitRes.json();
        const arbeitJobs = (arbeitData.data || []).map((job) => ({
          id: `arbeitnow-${job.id}`,
          title: job.title,
          company: job.company_name,
          companyLogo: job.company_logo || null,
          location: job.location || "Worldwide",
          employmentType: job.remote ? "remote" : "full-time",
          salary: job.salary || null,
          description: job.description,
          applyUrl: job.url,
          source: "Arbeitnow",
          postedAt: job.created_at,
          isRemote: !!job.remote,
          skills: [],
          tags: [],
        }));
        results.push(...arbeitJobs);
      }
    } catch (e) {
      console.error("Arbeitnow error:", e.message);
    }

    return res.status(200).json({
      jobs: results,
      total: results.length,
      page: Number(page),
    });
  } catch (error) {
    console.error("Job search error:", error.message);
    return res.status(500).json({ message: error.message });
  }
};

const getJobDetails = async (req, res) => {
  try {
    const { jobId } = req.params;

    if (!jobId) {
      return res.status(400).json({ message: "Job ID is required" });
    }

    // For Remotive jobs, fetch full details
    if (jobId.startsWith("remotive-")) {
      const numericId = jobId.replace("remotive-", "");
      try {
        const response = await fetch(`${REMOTIVE_BASE}?limit=100`);
        if (response.ok) {
          const data = await response.json();
          const job = (data.jobs || []).find((j) => String(j.id) === String(numericId));
          if (job) {
            return res.status(200).json({
              job: {
                id: `remotive-${job.id}`,
                title: job.title,
                company: job.company_name,
                companyLogo: job.company_logo,
                location: job.candidate_required_location || "Remote",
                employmentType: job.job_type,
                salary: job.salary,
                description: job.description,
                responsibilities: [],
                qualifications: [],
                benefits: [],
                applyUrl: job.url,
                source: "Remotive",
                postedAt: job.publication_date,
                isRemote: true,
                skills: job.tags || [],
              },
            });
          }
        }
      } catch (e) {
        console.error("Remotive detail error:", e.message);
      }
    }

    return res.status(404).json({ message: "Job not found" });
  } catch (error) {
    console.error("Job details error:", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export { searchJobs, getJobDetails };
